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
    
    public partial class PEDIDO_FORMA_PAGO
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PEDIDO_FORMA_PAGO()
        {
            this.PEDIDO_FORMA_PAGO_DET = new HashSet<PEDIDO_FORMA_PAGO_DET>();
        }
    
        public int ID_PEDIDO_FORMA_PAGO { get; set; }
        public string NOMBRE { get; set; }
        public string ESTADO { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PEDIDO_FORMA_PAGO_DET> PEDIDO_FORMA_PAGO_DET { get; set; }
    }
}