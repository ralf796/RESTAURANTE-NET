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
    
    public partial class COBRO_DETALLE
    {
        public int ID_COBRO_DETALLE { get; set; }
        public Nullable<int> ID_COBRO { get; set; }
        public Nullable<int> ID_PEDIDO_FORMA_PAGO { get; set; }
        public Nullable<decimal> MONTO { get; set; }
        public string DOCUMENTO { get; set; }
    
        public virtual COBRO COBRO { get; set; }
        public virtual PEDIDO_FORMA_PAGO PEDIDO_FORMA_PAGO { get; set; }
    }
}
