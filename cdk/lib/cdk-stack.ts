import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";

export class ReactStack extends cdk.Stack {
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

    // 3. Get Cert for SSL
    const cert = acm.Certificate.fromCertificateArn(
      this,
      "cert",
      `arn:aws:acm:us-east-1:${process.env.AWS_ACCOUNT}:certificate/${process.env.NJA_CERT_ID}`
    );

    // 4. CloudFront
    const distribution = new cloudfront.Distribution(
      this,
      "jcw-static-react-app-distribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        // React router quick fix
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
        defaultRootObject: "index.html", // CloudFront creates OAI by setting this... good to know AWS. Thanks @mattmurr
        domainNames: [
          `${process.env.NJA_SUB_DOMAIN}.${process.env.NJA_DOMAIN_NAME}`,
        ],
        certificate: cert, // Cert from step #3

        // Disabled WAF for now, although works if required
        // webAclId: `arn:aws:wafv2:us-east-1:${process.env.AWS_ACCOUNT}:global/webacl/${process.env.WEB_ACL_ID}`, // Add firewall with VPN restriction
      }
    );

    // 5. Create a DNS record to route traffic from our custom url to our distribution
    const record = new route53.CnameRecord(this, "record", {
      zone: route53.HostedZone.fromLookup(this, "zone", {
        domainName: process.env.NJA_DOMAIN_NAME ?? "",
      }),
      domainName: distribution.domainName,
      recordName: `${process.env.NJA_SUB_DOMAIN}.${process.env.NJA_DOMAIN_NAME}`,
    });

    // 6. Add permission boundary
    const boundary = iam.ManagedPolicy.fromManagedPolicyArn(
      this,
      "Boundary",
      `arn:aws:iam::${process.env.AWS_ACCOUNT}:policy/ScopePermissions`
    );

    iam.PermissionsBoundary.of(this).apply(boundary);

    // 7. Outputs
    new cdk.CfnOutput(this, "App URL", {
      value: record.domainName,
    });
  }
}
