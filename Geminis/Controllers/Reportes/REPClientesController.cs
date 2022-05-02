using Geminis.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Reportes
{
    public class REPClientesController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: REPClientes
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GenerarReporte(int anio, int mes)
        {
            try
            {
                string query = @" SELECT Format(A.fecha_creacion, 'dd/MM/yyyy') FECHA,
                                       a.id_cliente                           ID_CLIENTE,
                                       Count(*)                               PEDIDOS,
                                       a.nombre                               NOMBRE,
                                       b.telefono                             TELEFONO,
                                       b.nit                                  NIT,
                                       b.direccion                            DIRECCION,
                                       b.correo_electronico                   CORREO
                                FROM   pedido a
                                       INNER JOIN cliente b
                                               ON a.id_cliente = b.id_cliente
                                WHERE  Year(a.fecha_creacion) * 100 + Month(a.fecha_creacion) = 2022 * 100 + 5
                                GROUP  BY Format(A.fecha_creacion, 'dd/MM/yyyy'),
                                          a.id_cliente,
                                          a.nombre,
                                          b.telefono,
                                          b.nit,
                                          b.direccion,
                                          b.correo_electronico
                                ORDER  BY Count(*) DESC  ";
                var lista = db.Database.SqlQuery<REPORTE>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        public class REPORTE
        {
            public string FECHA { set; get; }
            public int? ID_CLIENTE { set; get; }
            public int? PEDIDOS { set; get; }
            public string NOMBRE { set; get; }
            public string TELEFONO { set; get; }
            public string NIT { set; get; }
            public string DIRECCION { set; get; }
            public string CORREO { set; get; }
        }

    }
}