use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, ToSchema, Clone)]
pub struct Vehiculo {
    pub id: Option<String>,
    pub placa: String,
    pub tipo: String,
    pub capacidad: i32,
    pub estado: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct VehiculoInput {
    pub placa: String,
    pub tipo: String,
    pub capacidad: i32,
    pub estado: String,
}
