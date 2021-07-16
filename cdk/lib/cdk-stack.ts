import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Hosting Bucket
    const bucket = new s3.Bucket(this, "jcw-static-react-app-hosting", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. Deployment bucket
    new s3Deployment.BucketDeployment(this, "jcw-static-react-app-deployment", {
      destinationBucket: bucket,
      sources: [s3Deployment.Source.asset("../build")],
      retainOnDelete: false,
    });

    // 3. CloudFront
    const distribution = new cloudfront.Distribution(
      this,
      "jcw-static-react-app-distribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
        defaultRootObject: "index.html", // CloudFront creates OAI by setting this... good to know AWS. Thanks @mattmurr
        webAclId: `arn:aws:wafv2:us-east-1:${process.env.AWS_ACCOUNT}:global/webacl/${process.env.WEB_ACL_ID}`, // Add firewall with VPN restriction
      }
    );

    // 4. Add permission boundary
    const boundary = iam.ManagedPolicy.fromManagedPolicyArn(
      this,
      "Boundary",
      `arn:aws:iam::${process.env.AWS_ACCOUNT}:policy/ScopePermissions`
    );

    iam.PermissionsBoundary.of(this).apply(boundary);

    // 5. Outputs
    new cdk.CfnOutput(this, "Bucket URL", {
      value: bucket.bucketDomainName, // We can't access at all (403)
    });

    new cdk.CfnOutput(this, "CloudFront URL", {
      value: distribution.distributionDomainName, // We can only access on VPN
    });
  }
}
