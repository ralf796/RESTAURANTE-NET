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
    public class INVMenuController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: INVMenu
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// LLENAR SELECTS TIPO_EMPLEADO
        /// </summary>
        /// <returns></returns>
        public JsonResult ObtenerTipoMenuSelect()
        {
            try
            {
                string query = "SELECT * FROM TIPO_MENU WHERE ESTADO = 'A' ";
                var lista = db.Database.SqlQuery<TIPO_MENU>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// GUARDAR EN TABLA EMPLEADO
        /// </summary>
        /// <param name="datos"> DEVUELVE EL JSON DESDE EL JS</param>
        /// <returns></returns>
         [SessionExpireFilter]
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<MENU>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    db.MENU.Add(obtenerDatos);
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

        /// <summary>
        /// EDITAR TABLA
        /// </summary>
        /// <param name="datos"></param>
        /// <returns></returns>
        public JsonResult Editar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<MENU>(datos);

                    string query = "SELECT * FROM MENU WHERE ID_MENU = " + obtenerDatos.ID_MENU;
                    var editarTabla = db.Database.SqlQuery<MENU>(query).SingleOrDefault();
                    editarTabla.ID_TIPO_MENU = obtenerDatos.ID_TIPO_MENU;
                    editarTabla.NOMBRE = obtenerDatos.NOMBRE;
                    editarTabla.PRECIO = obtenerDatos.PRECIO;
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

        public JsonResult Eliminar(string id)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = "SELECT * FROM MENU WHERE ID_MENU = " + id;
                    var editarTabla = db.Database.SqlQuery<MENU>(query).SingleOrDefault();
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

        /// <summary>
        /// CARGAR DATOS DE EMPLEADOS EN DEVEXTREME
        /// </summary>
        /// <returns></returns>
        public JsonResult CargarTablaMenu()
        {
            try
            {
                string query = @"SELECT 
                                A.ID_MENU,
	                            B.ID_TIPO_MENU,
                                B.NOMBRE AS TIPO_MENU, 
	                            A.NOMBRE,
	                            CONVERT(VARCHAR(20),
                                A.FECHA_CREACION) AS FECHA_CREACION, 
	                            A.CREADO_POR,
                                CONVERT(VARCHAR(20),
								A.PRECIO) AS PRECIO,
								A.ESTADO
                            FROM MENU A 
                            INNER JOIN TIPO_MENU B ON A.ID_TIPO_MENU=B.ID_TIPO_MENU";
                var lista = db.Database.SqlQuery<TABLA_MENU_>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        public class TABLA_MENU_
        {
            public int? ID_MENU { set; get; }
            public int? ID_TIPO_MENU { set; get; }
            public string TIPO_MENU { set; get; }
            public string NOMBRE { set; get; }
            public string FECHA_CREACION { set; get; }
            public string CREADO_POR { set; get; }
            public string PRECIO { set; get; }
            public string ESTADO { set; get; }
        }
    }
}