// main.rs
use std::sync::Arc;
use axum::Router;
use dotenvy::dotenv;
use mongodb::Client;

mod models;
mod routes;
mod auth;
mod grpc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    let mongo_url = std::env::var("MONGO_URL").unwrap_or_else(|_| "mongodb://mongo:27017".into());
    let client = Arc::new(Client::with_uri_str(&mongo_url).await?);

    let app: Router = routes::build_router(client.clone());

    let http_port = std::env::var("VEHICULOS_HTTP_PORT").unwrap_or_else(|_| "3002".into());
    let addr = format!("0.0.0.0:{}", http_port);

    let grpc_client = client.clone();
    tokio::spawn(async move {
        if let Err(e) = grpc::run_grpc(grpc_client).await {
            eprintln!("gRPC error: {e}");
        }
    });

    println!("REST Vehículos en http://localhost:{}/vehiculos", http_port);

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
