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
    
    public partial class UNIDAD_MEDIDA
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public UNIDAD_MEDIDA()
        {
            this.INVENTARIO_BODEGA_GENERAL = new HashSet<INVENTARIO_BODEGA_GENERAL>();
            this.INVENTARIO_BODEGA_GENERAL1 = new HashSet<INVENTARIO_BODEGA_GENERAL>();
            this.INVENTARIO_BODEGA_GENERAL2 = new HashSet<INVENTARIO_BODEGA_GENERAL>();
            this.INVENTARIO_COCINA = new HashSet<INVENTARIO_COCINA>();
            this.INVENTARIO_COCINA1 = new HashSet<INVENTARIO_COCINA>();
            this.INVENTARIO_COCINA2 = new HashSet<INVENTARIO_COCINA>();
            this.PRODUCTO = new HashSet<PRODUCTO>();
            this.PRODUCTO1 = new HashSet<PRODUCTO>();
            this.PRODUCTO2 = new HashSet<PRODUCTO>();
        }
    
        public int ID_UNIDAD_MEDIDA { get; set; }
        public string DESCRIPCION { get; set; }
        public string ESTADO { get; set; }
        public string ABREVIATURA { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<INVENTARIO_BODEGA_GENERAL> INVENTARIO_BODEGA_GENERAL { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<INVENTARIO_BODEGA_GENERAL> INVENTARIO_BODEGA_GENERAL1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<INVENTARIO_BODEGA_GENERAL> INVENTARIO_BODEGA_GENERAL2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<INVENTARIO_COCINA> INVENTARIO_COCINA { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<INVENTARIO_COCINA> INVENTARIO_COCINA1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<INVENTARIO_COCINA> INVENTARIO_COCINA2 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PRODUCTO> PRODUCTO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PRODUCTO> PRODUCTO1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PRODUCTO> PRODUCTO2 { get; set; }
    }
}
