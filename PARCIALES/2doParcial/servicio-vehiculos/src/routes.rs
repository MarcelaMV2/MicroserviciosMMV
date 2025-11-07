use std::sync::Arc;
use axum::{
    Router,
    routing::{get, post, put, delete as axum_delete}, // <-- alias para evitar choque
    Json, extract::Path, http::StatusCode
};
use futures_util::StreamExt;
use mongodb::{Client, bson::{doc, oid::ObjectId, self}};
use crate::models::{Vehiculo, VehiculoInput};
use utoipa::{OpenApi, ToSchema};
use utoipa_swagger_ui::SwaggerUi;
use axum::middleware::from_fn;
use crate::auth::jwt_middleware;

fn col(client: &Client) -> mongodb::Collection<bson::Document> {
    let db = std::env::var("MONGO_DB").unwrap_or_else(|_| "logistica".into());
    client.database(&db).collection::<bson::Document>("vehiculos")
}

fn doc_to_model(doc: bson::Document) -> Vehiculo {
    Vehiculo {
        id: doc.get_object_id("_id").ok().map(|o| o.to_hex()),
        placa: doc.get_str("placa").unwrap_or_default().to_string(),
        tipo: doc.get_str("tipo").unwrap_or_default().to_string(),
        capacidad: doc.get_i32("capacidad").unwrap_or_default(),
        estado: doc.get_str("estado").unwrap_or_default().to_string(),
    }
}

#[utoipa::path(get, path = "/vehiculos", responses(
    (status = 200, description = "Lista de vehículos", body = [Vehiculo])
))]
async fn list(client: Arc<Client>) -> Result<Json<Vec<Vehiculo>>, StatusCode> {
    let collection = col(&client);
    let mut cursor = collection.find(None, None).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let mut out = vec![];
    while let Some(doc) = cursor.try_next().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)? {
        out.push(doc_to_model(doc));
    }
    Ok(Json(out))
}

#[utoipa::path(get, path = "/vehiculos/{id}", params(("id"=String, Path, description="ObjectId de Mongo")),
    responses(
        (status = 200, description = "Vehículo", body = Vehiculo),
        (status = 404, description = "No encontrado")
    )
)]
async fn get_one(Path(id): Path<String>, client: Arc<Client>) -> Result<Json<Vehiculo>, StatusCode> {
    let collection = col(&client);
    let oid = ObjectId::parse_str(&id).map_err(|_| StatusCode::BAD_REQUEST)?;
    let doc = collection.find_one(doc!{"_id": oid}, None).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    match doc {
        Some(d) => Ok(Json(doc_to_model(d))),
        None => Err(StatusCode::NOT_FOUND)
    }
}

#[utoipa::path(post, path = "/vehiculos", request_body = VehiculoInput,
    responses((status = 201, description = "Creado", body = Vehiculo))
)]
async fn create(Json(input): Json<VehiculoInput>, client: Arc<Client>) -> Result<(StatusCode, Json<Vehiculo>), StatusCode> {
    if !["disponible","en_ruta","mantenimiento"].contains(&input.estado.as_str()) {
        return Err(StatusCode::BAD_REQUEST);
    }
    let collection = col(&client);

    let doc = doc!{
        "placa": input.placa.clone(),
        "tipo": input.tipo.clone(),
        "capacidad": input.capacidad,
        "estado": input.estado.clone()
    };
    let res = collection.insert_one(doc, None).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let id = res.inserted_id.as_object_id().unwrap().to_hex();

    let v = Vehiculo {
        id: Some(id),
        placa: input.placa,
        tipo: input.tipo,
        capacidad: input.capacidad,
        estado: input.estado
    };
    Ok((StatusCode::CREATED, Json(v)))
}

#[utoipa::path(put, path = "/vehiculos/{id}", request_body = VehiculoInput,
    params(("id"=String, Path, description="ObjectId de Mongo")),
    responses((status = 204, description = "Actualizado"))
)]
async fn update(Path(id): Path<String>, Json(input): Json<VehiculoInput>, client: Arc<Client>) -> Result<StatusCode, StatusCode> {
    let collection = col(&client);
    let oid = ObjectId::parse_str(&id).map_err(|_| StatusCode::BAD_REQUEST)?;
    collection.replace_one(doc!{"_id": oid}, bson::to_document(&input).unwrap(), None)
        .await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::NO_CONTENT)
}

#[utoipa::path(delete, path = "/vehiculos/{id}",
    params(("id"=String, Path, description="ObjectId de Mongo")),
    responses((status = 204, description = "Eliminado"))
)]
async fn delete_vehicle(Path(id): Path<String>, client: Arc<Client>) -> Result<StatusCode, StatusCode> {
    let collection = col(&client);
    let oid = ObjectId::parse_str(&id).map_err(|_| StatusCode::BAD_REQUEST)?;
    collection.delete_one(doc!{"_id": oid}, None).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(utoipa::OpenApi)]
#[openapi(
    paths(list, get_one, create, update, delete_vehicle),
    components(schemas(Vehiculo, VehiculoInput)),
    tags((name = "vehiculos", description = "CRUD de vehículos (JWT protegido)"))
)]
pub struct ApiDoc;

pub fn build_router(client: Arc<Client>) -> Router {
    Router::new()
        .route(
            "/vehiculos",
            get({
                let c = client.clone();
                move || list(c.clone())
            })
            .post({
                let c = client.clone();
                move |payload| create(payload, c.clone())
            })
        )
        .route(
            "/vehiculos/:id",
            get({
                let c = client.clone();
                move |id| get_one(id, c.clone())
            })
            .put({
                let c = client.clone();
                move |id, payload| update(id, payload, c.clone())
            })
            .delete({
                let c = client.clone();
                move |id| delete_vehicle(id, c.clone())
            })
        )
        .layer(from_fn(jwt_middleware))
        .merge(SwaggerUi::new("/vehiculos/swagger").url("/vehiculos/openapi.json", ApiDoc::openapi()))
}
