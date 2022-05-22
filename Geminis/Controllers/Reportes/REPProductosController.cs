﻿using Geminis.Models;
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

        public JsonResult GenerarReporte(int anio, int mes)
        {
            try
            {
                string query = @" SELECT Format(A.fecha_creacion, 'dd/MM/yyyy') AS FECHA,
                                       C.nombre NOMBRE,
                                       Sum(B.cantidad) * Sum(B.precio)        TOTAL
                                FROM   pedido A
                                       INNER JOIN pedido_detalle B
                                               ON A.id_pedido = B.id_pedido
                                       INNER JOIN menu C
                                               ON C.id_menu = B.id_menu
                                       INNER JOIN tipo_menu D
                                               ON D.id_tipo_menu = C.id_tipo_menu
                                WHERE  Year(a.fecha_creacion) * 100 + Month(a.fecha_creacion) = " + anio + " * 100 + " + mes + @"
                                       AND B.estado = 'A'
                                GROUP BY Format(A.fecha_creacion, 'dd/MM/yyyy'),
                                          B.id_menu,
                                          C.nombre  ";
                var lista = db.Database.SqlQuery<REPORTE>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GenerarGrafica(int anio, int mes)
        {
            try
            {
                string query = @" SELECT C.nombre NOMBRE,
                                       Sum(B.cantidad) * Sum(B.precio) TOTAL
                                FROM   pedido A
                                       INNER JOIN pedido_detalle B
                                               ON A.id_pedido = B.id_pedido
                                       INNER JOIN menu C
                                               ON C.id_menu = B.id_menu
                                       INNER JOIN tipo_menu D
                                               ON D.id_tipo_menu = C.id_tipo_menu
                                WHERE  Year(a.fecha_creacion) * 100 + Month(a.fecha_creacion) = " + anio + " * 100 + " + mes + @"
                                       AND B.estado = 'A'
                                GROUP  BY C.nombre
                                ORDER  BY 2  ";
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
            public string NOMBRE { set; get; }
            public decimal? TOTAL { set; get; }
        }

    }
}