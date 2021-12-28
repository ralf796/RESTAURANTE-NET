using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Controllers.Inventario
{
    public class INVTipoMenuController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: INVTipoMenu
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
                    var obtenerDatos = JsonConvert.DeserializeObject<TIPO_MENU>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = "LUISG";
                    db.TIPO_MENU.Add(obtenerDatos);
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

        public JsonResult Eliminar(string id)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = "SELECT * FROM TIPO_MENU WHERE ID_TIPO_MENU = " + id;
                    var editarTabla = db.Database.SqlQuery<TIPO_MENU>(query).SingleOrDefault();
                    editarTabla.ESTADO = "I";
                    db.Entry(editarTabla).State = EntityState.Modified;
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

        public JsonResult Editar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TIPO_MENU>(datos);

                    string query = "SELECT * FROM TIPO_MENU WHERE ID_TIPO_MENU = " + obtenerDatos.ID_TIPO_MENU;
                    var editarTabla = db.Database.SqlQuery<TIPO_MENU>(query).SingleOrDefault();
                    editarTabla.ID_TIPO_MENU = obtenerDatos.ID_TIPO_MENU;
                    editarTabla.NOMBRE = obtenerDatos.NOMBRE;

                    db.Entry(editarTabla).State = EntityState.Modified;
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

        public JsonResult CargarTablaTipoMenu()
        {
            try
            {
                string query = @"SELECT ID_TIPO_MENU, NOMBRE, CREADO_POR, CONVERT(VARCHAR(20), FECHA_CREACION) AS FECHA_CREACION, ESTADO FROM TIPO_MENU";
                var lista = db.Database.SqlQuery<TABLA_TIPO_MENU_>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public class TABLA_TIPO_MENU_
        {
            public int? ID_TIPO_MENU { set; get; }
            public string NOMBRE { set; get; }
            public string CREADO_POR { set; get; }
            public string FECHA_CREACION { set; get; }
            public string ESTADO { set; get; }

        }
    }
}