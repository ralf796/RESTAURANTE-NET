using Geminis.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Reportes
{
    public class REPProductosController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();

        // GET: REPProductos
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GenerarReporte(DateTime fechaInicial, DateTime fechaFinal)
        {
            try
            {
                string query = @"  SELECT Format(A.fecha_creacion, 'dd/MM/yyyy') AS FECHA,
                                           D.nombre                               AS CATEGORIA,
                                           C.nombre                               NOMBRE,
                                           Sum(b.cantidad)                        AS CANTIDAD,
                                           Sum(b.subtotal)                        AS TOTAL
                                    FROM   pedido a
                                           INNER JOIN pedido_detalle b
                                                   ON a.id_pedido = b.id_pedido
                                           INNER JOIN menu c
                                                   ON c.id_menu = b.id_menu
                                           INNER JOIN tipo_menu D
                                                   ON D.id_tipo_menu = C.id_tipo_menu
                                WHERE CONVERT(varchar,a.fecha_creacion,21) between  '" + fechaInicial.ToString("yyyy-MM-dd") + "' and '" + fechaFinal.ToString("yyyy-MM-dd") + @"'
                                    GROUP  BY Format(A.fecha_creacion, 'dd/MM/yyyy'),
                                              D.nombre,
                                              C.nombre  
                                    ORDER BY 1,2,3";
                var lista = db.Database.SqlQuery<REPORTE>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GenerarGrafica(DateTime fechaInicial, DateTime fechaFinal)
        {
            try
            {
                string query = @" SELECT C.nombre        NOMBRE,
                                       Sum(b.cantidad) AS CANTIDAD,
                                       Sum(b.subtotal) AS TOTAL
                                FROM   pedido a
                                       INNER JOIN pedido_detalle b
                                               ON a.id_pedido = b.id_pedido
                                       INNER JOIN menu c
                                               ON c.id_menu = b.id_menu
                                       INNER JOIN tipo_menu D
                                               ON D.id_tipo_menu = C.id_tipo_menu
                                WHERE CONVERT(varchar,a.fecha_creacion,21) between  '" + fechaInicial.ToString("yyyy-MM-dd") + "' and '" + fechaFinal.ToString("yyyy-MM-dd") + @"'
                                GROUP  BY C.nombre
                                ORDER  BY 3";
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
            public string CATEGORIA { set; get; }
            public string NOMBRE { set; get; }
            public int CANTIDAD { set; get; }
            public decimal? TOTAL { set; get; }
        }

    }
}