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
    }
}
