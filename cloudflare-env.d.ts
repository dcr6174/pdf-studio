declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ANALYTICS_OWNER_EMAIL?: string;
    OWNER_PASSWORD?: string;
    BUCKET?: R2Bucket;
  }
}
