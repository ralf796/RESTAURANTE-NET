using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Reportes
{
    public class REPGananciasController : Controller
    {
        // GET: REPGanancias
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GenerarReporte(int anio, int mes)
        {
            try
            {
                string query = @" SELECT Format(A.fecha_creacion, 'dd/MM/yyyy')       FECHA,
                                       A.id_tipo_pedido                             ID_TIPO_PEDIDO,
                                       B.nombre                                     TIPO_PEDIDO,
                                       Sum(C.subtotal)                              TOTAL,
                                       Sum(C.subtotal) - Sum(e.cantidad * f.precio) ganancias
                                FROM   pedido A
                                       INNER JOIN tipo_pedido B
                                               ON A.id_tipo_pedido = B.id_tipo_pedido
                                       INNER JOIN pedido_detalle C
                                               ON C.id_pedido = A.id_pedido
                                       INNER JOIN menu D
                                               ON D.id_menu = C.id_menu
                                       INNER JOIN menu_detalle e
                                               ON e.id_menu = d.id_menu
                                       INNER JOIN inventario_cocina f
                                               ON f.id_inventario_cocina = e.id_inventario_cocina
                                WHERE  Year(a.fecha_creacion) * 100 + Month(a.fecha_creacion) = 2022 * 100 + 5
                                GROUP  BY Format(A.fecha_creacion, 'dd/MM/yyyy'),
                                          A.id_tipo_pedido,
                                          B.nombre  ";
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
            public int? ID_EMPLEADO { set; get; }
            public int? PEDIDOS { set; get; }
            public string NOMBRE { set; get; }
            public string FECHA { set; get; }
        }

    }
}