using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Geminis.Clases;
using Geminis.Models;
using Newtonsoft.Json;

namespace Geminis.Controllers.Inventario
{
    public class INVDetalleMenuController : Controller
    {
        readonly Restaurante_BDEntities bd = new Restaurante_BDEntities();
        [SessionExpireFilter]
        // GET: INVDetalleMenu
        public ActionResult Index()
        {
            return View();
        }
        //CARGAR SELECT MENU
        public JsonResult ObtenerMenuSelect()
        {
            try
            {
                var query = "SELECT * FROM MENU WHERE ESTADO = 'A'";
                var lista = bd.Database.SqlQuery<MENU>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        //CARGAR SELECT COCINA
        public JsonResult ObtenerCocinaSelect()
        {
            try
            {
                var query = "SELECT * FROM INVENTARIO_COCINA";
                var lista = bd.Database.SqlQuery<INVENTARIO_COCINA>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        //FUNCION GUARDAR
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = bd.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<MENU_DETALLE>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.CREADO_POR = "EVASQUEZ";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    bd.MENU_DETALLE.Add(obtenerDatos);
                    bd.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje=ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
               
        }
        //FUNCION EDITAR
        public JsonResult Editar(string datos)
        {
            using(var transaccion= bd.Database.BeginTransaction())
            {
                try
                {
                    var datosObtenidos = JsonConvert.DeserializeObject<MENU_DETALLE>(datos);
                    string query = "SELECT * FROM MENU_DETALLE WHERE ID_MENU_DETALLE=" + datosObtenidos.ID_MENU_DETALLE;
                    var editarDatos = bd.Database.SqlQuery<MENU_DETALLE>(query).SingleOrDefault();
                    editarDatos.ID_MENU_DETALLE = datosObtenidos.ID_MENU_DETALLE;
                    editarDatos.ID_MENU = datosObtenidos.ID_MENU;
                    editarDatos.ID_INVENTARIO_COCINA = datosObtenidos.ID_INVENTARIO_COCINA;
                    editarDatos.CANTIDAD = datosObtenidos.CANTIDAD;
                    bd.Entry(editarDatos).State = EntityState.Modified;
                    bd.SaveChanges();
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
        //CARGAR DATOS EN DEVEXTREME
        public JsonResult CargarDetalleMenu()
        {
            try
            {
                string query = @"SELECT A.ID_MENU_DETALLE, 
                                 B.ID_MENU, B.NOMBRE AS NOMBRE_MENU, 
                                 C.ID_INVENTARIO_COCINA, C.NOMBRE AS PRODUCTO,  
                                 ISNULL(A.CANTIDAD,0) AS CANTIDAD, A.ESTADO, 
                                 A.CREADO_POR, CONVERT(VARCHAR(20),A.FECHA_CREACION) AS FECHA_CREACION
                                 FROM MENU_DETALLE A
                                 INNER JOIN MENU B ON
                                 A.ID_MENU=B.ID_MENU
                                 INNER JOIN INVENTARIO_COCINA C ON
                                 A.ID_INVENTARIO_COCINA= C.ID_INVENTARIO_COCINA";
                var lista = bd.Database.SqlQuery<DETALLE_MENU_>(query).ToList();
                return Json(new { Estado = 1, data = lista }, JsonRequestBehavior.AllowGet); 
            }
            catch (Exception ex)
            {
                  return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public class DETALLE_MENU_
        {
            public int? ID_MENU_DETALLE { get; set; }
            public int? ID_MENU { get; set; }
            public string NOMBRE_MENU { get; set; }
            public int? ID_INVENTARIO_COCINA { get; set; }
            public string PRODUCTO { get; set; }
            public decimal CANTIDAD { get; set; }
            public string ESTADO { get; set; }
            public string CREADO_POR { get; set; }
            public string FECHA_CREACION { get; set; }
        }

    }
}