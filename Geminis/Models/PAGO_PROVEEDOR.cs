//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Geminis.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class PAGO_PROVEEDOR
    {
        public int ID_PAGO_PROVEEDOR { get; set; }
        public int ID_PROVEEDOR { get; set; }
        public int ID_BANCO { get; set; }
        public int NO_CUENTA { get; set; }
        public string NOMBRE_CUENTA { get; set; }
        public string TELEFONO { get; set; }
        public string DIRECCION { get; set; }
        public Nullable<System.DateTime> FECHA_CREACION { get; set; }
        public string ESTADO { get; set; }
        public string CREADO_POR { get; set; }
    
        public virtual BANCO BANCO { get; set; }
        public virtual BANCO BANCO1 { get; set; }
        public virtual BANCO BANCO2 { get; set; }
        public virtual PROVEEDOR PROVEEDOR { get; set; }
        public virtual PROVEEDOR PROVEEDOR1 { get; set; }
        public virtual PROVEEDOR PROVEEDOR2 { get; set; }
    }
}
