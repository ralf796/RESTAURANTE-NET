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
    
    public partial class FACTURA_ENCABEZADO
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public FACTURA_ENCABEZADO()
        {
            this.FACTURA_DETALLE = new HashSet<FACTURA_DETALLE>();
        }
    
        public int ID_FACTURA_ENCABEZADO { get; set; }
        public int SERIE { get; set; }
        public int NO_FACTURA { get; set; }
        public string RESOLUCION { get; set; }
        public int ID_CLIENTE { get; set; }
        public Nullable<System.DateTime> FECHA_FACTURA { get; set; }
        public Nullable<decimal> TOTAL_FACTURA { get; set; }
        public Nullable<decimal> TOTAL_IVA { get; set; }
        public Nullable<decimal> SUBTOTAL_FACTURA { get; set; }
        public string NIT { get; set; }
        public string DIRECCION { get; set; }
        public string NOMBRE_CLIENTE { get; set; }
        public Nullable<System.DateTime> FECHA_CREACION { get; set; }
        public string ESTADO { get; set; }
        public string CREADO_POR { get; set; }
    
        public virtual CLIENTE CLIENTE { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FACTURA_DETALLE> FACTURA_DETALLE { get; set; }
    }
}
