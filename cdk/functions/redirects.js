exports.handler = (event) => {
  const {
    request: { uri },
    request,
  } = event;

  console.log(request);

  // Redirect API requests
  if (uri.includes("/api")) {
    const redirect = `${process.env.API_URL}/${uri.split("/api/")[1]}`;

    const response = {
      statusCode: 301,
      statusDescription: "Found",
      headers: {
        "cloudfront-functions": { value: "generated-by-CloudFront-Functions" },
        location: { value: redirect },
      },
    };
    return response;
  }

  // Always redirect to root index.html
  if (uri.endsWith("/") || !uri.includes(".")) {
    request.uri = "/index.html";
  }

  return request;
};
