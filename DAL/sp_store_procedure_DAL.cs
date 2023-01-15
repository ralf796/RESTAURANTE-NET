using BE;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class sp_store_procedure_DAL:IDisposable
    {
        public void Dispose() { }

        public List<Login_BE> sp_login(Login_BE item)
        {
            List<Login_BE> result = new List<Login_BE>();
            using (var model = new Base_SQL("sp_login"))
            {
                model.Command.Parameters.AddWithValue("@MTIPO", item.MTIPO);
                model.Command.Parameters.AddWithValue("@USUARIO", item.USUARIO);
                model.Command.Parameters.AddWithValue("@PASSWORD", item.PASSWORD);
                model.Command.Parameters.AddWithValue("@ID_MODULO", item.ID_MODULO);
                model.Command.Parameters.AddWithValue("@URL", item.URL);
                model.Command.Parameters.AddWithValue("@PANTALLA", item.PANTALLA);
                result = model.GetData<Login_BE>();
            }
            return result;
        }
        public List<Administracion_BE> sp_administracion(Administracion_BE item)
        {
            List<Administracion_BE> result = new List<Administracion_BE>();
            using (var model = new Base_SQL("sp_administracion"))
            {
                model.Command.Parameters.AddWithValue("@MTIPO", item.MTIPO);
                model.Command.Parameters.AddWithValue("@NOMBRE", item.NOMBRE);
                model.Command.Parameters.AddWithValue("@DIRECCION", item.DIRECCION);
                model.Command.Parameters.AddWithValue("@NIT", item.NIT);
                model.Command.Parameters.AddWithValue("@TELEFONO", item.TELEFONO);
                model.Command.Parameters.AddWithValue("@CORREO", item.CORREO_ELECTRONICO);
                model.Command.Parameters.AddWithValue("@CREADO_POR", item.CREADO_POR);
                model.Command.Parameters.AddWithValue("@ID_TIPO_EMPLEADO", item.ID_TIPO_EMPLEADO);
                model.Command.Parameters.AddWithValue("@SALARIO", item.SALARIO);
                model.Command.Parameters.AddWithValue("@ID_EMPLEADO", item.ID_EMPLEADO);
                model.Command.Parameters.AddWithValue("@REFERENCIA", item.REFERENCIA);
                model.Command.Parameters.AddWithValue("@ID_PROVEEDOR", item.ID_PROVEEDOR);
                result = model.GetData<Administracion_BE>();
            }
            return result;
        }
    }
}
