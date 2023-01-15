using BE;
using BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Geminis.Clases
{
    public class BackTools
    {
        public static List<Login_BE> Login_store_procedure(Login_BE item)
        {
            List<Login_BE> lista = new List<Login_BE>();
            lista = sp_store_procedure_BLL.sp_login(item);
            return lista;
        }
    }
}