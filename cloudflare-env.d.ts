declare namespace Cloudflare {
  interface Env {
    SERV_API_KEY?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
