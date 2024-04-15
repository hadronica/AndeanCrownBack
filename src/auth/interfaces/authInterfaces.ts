export interface iUser {
  email:string;
  phone:string;
  names?:string;
  typeDocument: string;
  numberDocument:string;
  typeAccount: "J" | "N"; //J es persona jurídica y N es persona natural
  permissionAccount: "User" | "Admin";
  legalRepresentation?:string;  //Este dato solo es válido para persona jurídica
  statement:{
    id:0 | 1 | 2; //0 es Activo, 1 es Por activar, 2 es Inactivo
    description:'Activo' | 'Por activar' | 'Inactivo';
  };
}

export interface iGeneratePassword {
  email:string;
}

export interface iGeneratePasswordLastStept {
  token:string;
  password:string;
  repeatPassword:string;
}

export interface IDocument {
  numberDocumentUser:string; // Número de documento del usuario
  urlStatementAccount:string; // Url del estado de cuenta del usuario
  emailUser:string; // Correo del usuario
}

