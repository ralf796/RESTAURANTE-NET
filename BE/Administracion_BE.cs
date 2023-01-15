using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE
{
    public class Administracion_BE
    {
        public int? ID_EMPLEADO { set; get; }
        public int? ID_TIPO_EMPLEADO { set; get; }
        public string TIPO_EMPLEADO { set; get; }
        public string NOMBRE { set; get; }
        public string TELEFONO { set; get; }
        public string DIRECCION { set; get; }
        public decimal? SALARIO { set; get; }
        public string CORREO_ELECTRONICO { set; get; }
        public string ESTADO { set; get; }
        public string FECHA_CREACION { set; get; }
        public string CREADO_POR { set; get; }
        public int? ID_PROVEEDOR { set; get; }
        public string REFERENCIA { set; get; }
    }
}
