using BE;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class sp_store_procedure_BLL : IDisposable
    {
        public void Dispose() { }

        public static List<Login_BE> sp_login(Login_BE item)
        {
            List<Login_BE> data = null;
            using (var model = new sp_store_procedure_DAL())
            {
                data = model.sp_login(item);
            }
            return data;
        }
    }
}
