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
    
    public partial class INVENTARIO_BODEGA_GENERAL
    {
        public int ID_BODEGA_GENERAL { get; set; }
        public string NOMBRE_PRODUCTO { get; set; }
        public string DESCRIPCION { get; set; }
        public Nullable<int> CANTIDAD { get; set; }
        public Nullable<System.DateTime> FECHA_INGRESO { get; set; }
        public Nullable<System.DateTime> FECHA_SALIDA { get; set; }
        public Nullable<int> EXISTENCIA { get; set; }
        public Nullable<decimal> PRECIO { get; set; }
    }
}
