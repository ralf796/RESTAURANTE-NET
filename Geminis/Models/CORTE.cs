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
    
    public partial class CORTE
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CORTE()
        {
            this.COBRO = new HashSet<COBRO>();
            this.COBRO1 = new HashSet<COBRO>();
            this.COBRO2 = new HashSet<COBRO>();
        }
    
        public int ID_CORTE { get; set; }
        public Nullable<decimal> TOTAL { get; set; }
        public Nullable<System.DateTime> FECHA_CREACION { get; set; }
        public string CREADO_POR { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<COBRO> COBRO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<COBRO> COBRO1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<COBRO> COBRO2 { get; set; }
    }
}
