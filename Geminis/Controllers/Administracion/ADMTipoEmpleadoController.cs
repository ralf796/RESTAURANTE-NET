using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Administracion
{
    public class ADMTipoEmpleadoController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: ADMTipoProveedor
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TIPO_EMPLEADO>(datos);
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    obtenerDatos.FECHA_CREACION= DateTime.Now;
                    obtenerDatos.ESTADO= "A";
                    db.TIPO_EMPLEADO.Add(obtenerDatos);
                    db.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }
    }
}