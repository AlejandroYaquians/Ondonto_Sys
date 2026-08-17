export interface ContactoPaciente {
  idContacto: number;
  nombreCompleto: string;
  telefonoContacto: string | null;
  idPaciente: number;
  idParentesco: number | null;
}

export interface ContactoPacienteRequest {
  nombreCompleto: string;
  telefonoContacto: string | null;
  idPaciente: number;
  idParentesco: number | null;
}
