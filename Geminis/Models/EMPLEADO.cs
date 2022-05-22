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
    
    public partial class EMPLEADO
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public EMPLEADO()
        {
            this.PEDIDO = new HashSet<PEDIDO>();
            this.USUARIO = new HashSet<USUARIO>();
            this.USUARIO1 = new HashSet<USUARIO>();
            this.USUARIO2 = new HashSet<USUARIO>();
            this.VALES = new HashSet<VALES>();
            this.VALES1 = new HashSet<VALES>();
            this.VALES2 = new HashSet<VALES>();
        }
    
        public int ID_EMPLEADO { get; set; }
        public int ID_TIPO_EMPLEADO { get; set; }
        public string NOMBRE { get; set; }
        public Nullable<decimal> SALARIO { get; set; }
        public string TELEFONO { get; set; }
        public string CORREO_ELECTRONICO { get; set; }
        public string DIRECCION { get; set; }
        public string ESTADO { get; set; }
        public string CREADO_POR { get; set; }
        public Nullable<System.DateTime> FECHA_CREACION { get; set; }
    
        public virtual TIPO_EMPLEADO TIPO_EMPLEADO { get; set; }
        public virtual TIPO_EMPLEADO TIPO_EMPLEADO1 { get; set; }
        public virtual TIPO_EMPLEADO TIPO_EMPLEADO2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PEDIDO> PEDIDO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<USUARIO> USUARIO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<USUARIO> USUARIO1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<USUARIO> USUARIO2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<VALES> VALES { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<VALES> VALES1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<VALES> VALES2 { get; set; }
    }
}
