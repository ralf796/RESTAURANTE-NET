﻿using Geminis.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Reportes
{
    public class REPRepartidoresController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();

        // GET: REPRepartidores
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GenerarReporte(int anio, int mes)
        {
            try
            {
                string query = @" SELECT A.id_empleado ID_EMPLEADO,
                                       Count(*)                               PEDIDOS,
                                       B.nombre NOMBRE,
                                       Format(A.fecha_creacion, 'dd/MM/yyyy') AS FECHA
                                FROM   pedido A
                                       INNER JOIN empleado B
                                               ON A.REPARTIDOR = B.id_empleado
                                WHERE  Year(a.fecha_creacion) * 100 + Month(a.fecha_creacion) = 2022 * 100 + 5
                                GROUP  BY A.id_empleado,
                                          B.nombre,
                                          Format(A.fecha_creacion, 'dd/MM/yyyy')
                                ORDER  BY Format(A.fecha_creacion, 'dd/MM/yyyy') DESC  ";
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