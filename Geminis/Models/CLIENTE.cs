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
    
    public partial class CLIENTE
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CLIENTE()
        {
            this.CLIENTE_DATOS_ADICIONALES = new HashSet<CLIENTE_DATOS_ADICIONALES>();
            this.FACTURA_ENCABEZADO = new HashSet<FACTURA_ENCABEZADO>();
            this.PEDIDO = new HashSet<PEDIDO>();
        }
    
        public int ID_CLIENTE { get; set; }
        public string NOMBRE_CLIENTE { get; set; }
        public string DIRECCION { get; set; }
        public string NIT { get; set; }
        public string TELEFONO { get; set; }
        public string ESTADO { get; set; }
        public string CREADO_POR { get; set; }
        public Nullable<System.DateTime> FECHA_CREACION { get; set; }
        public string CORREO_ELECTRONICO { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CLIENTE_DATOS_ADICIONALES> CLIENTE_DATOS_ADICIONALES { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FACTURA_ENCABEZADO> FACTURA_ENCABEZADO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PEDIDO> PEDIDO { get; set; }
    }
}
