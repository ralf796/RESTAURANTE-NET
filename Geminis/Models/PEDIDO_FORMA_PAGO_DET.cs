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
    
    public partial class PEDIDO_FORMA_PAGO_DET
    {
        public int ID_PEDIDO_PAGO { get; set; }
        public Nullable<int> ID_PEDIDO { get; set; }
        public Nullable<int> ID_PEDIDO_FORMA_PAGO { get; set; }
        public Nullable<decimal> MONTO { get; set; }
        public string REFERENCIA { get; set; }
        public string AUTORIZACION { get; set; }
    
        public virtual PEDIDO PEDIDO { get; set; }
        public virtual PEDIDO PEDIDO1 { get; set; }
        public virtual PEDIDO PEDIDO2 { get; set; }
        public virtual PEDIDO_FORMA_PAGO PEDIDO_FORMA_PAGO { get; set; }
        public virtual PEDIDO_FORMA_PAGO PEDIDO_FORMA_PAGO1 { get; set; }
        public virtual PEDIDO_FORMA_PAGO PEDIDO_FORMA_PAGO2 { get; set; }
    }
}
