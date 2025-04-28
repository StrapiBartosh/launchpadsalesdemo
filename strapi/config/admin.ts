const getPreviewPathname = (uid, { locale, document }): string => {
  const { slug } = document;

  switch (uid) {
    case "api::page.page":
      switch (slug) {
        case "homepage":
          return `/${locale}`;
        case "pricing":
          return "/pricing";
        case "contact":
          return "/contact";
        case "faq":
          return "/faq";
      }
    case "api::product.product": {
      if (!slug) {
        return "/products";
      }

      return `/products/${slug}`;
    }
    case "api::article.article": {
      if (!slug) {
        return "/blog";
      }

      return `/blog/${slug}`;
    }
  }

  return "/";
};

export default ({ env }) => {
  const clientUrl = env("CLIENT_URL");
  const previewSecret = env("PREVIEW_SECRET");

  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    flags: {
      nps: env.bool("FLAG_NPS", false),
      promoteEE: env.bool("FLAG_PROMOTE_EE", false),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: [clientUrl],
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi.documents(uid).findOne({ documentId });

          // Use Next.js draft mode
          const urlSearchParams = new URLSearchParams({
            url: getPreviewPathname(uid, { locale, document }),
            secret: previewSecret,
            status,
          });

          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
