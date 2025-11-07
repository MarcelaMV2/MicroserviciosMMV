use axum::{http::StatusCode, http::Request, response::Response};
use axum::middleware::Next; 
use jsonwebtoken::{DecodingKey, Validation, Algorithm, decode};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub async fn jwt_middleware<B>(req: Request<B>, next: axum::middleware::Next<B>) -> Result<Response, StatusCode> {

    let auth = req.headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .unwrap_or("");

    if !auth.starts_with("Bearer ") {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let token = auth.trim_start_matches("Bearer ").trim();
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret123".into());

    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::new(Algorithm::HS256),
    ).map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(next.run(req).await)
}
