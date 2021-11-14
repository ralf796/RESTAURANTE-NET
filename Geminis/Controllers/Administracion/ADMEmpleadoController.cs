using Geminis.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Geminis.Scripts.Administracion
{
    public class ADMEmpleadoController : Controller
    {
        readonly Restaurante_BDEntities db = new Restaurante_BDEntities();
        // GET: ADMEmpleado
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// LLENAR SELECTS TIPO_EMPLEADO
        /// </summary>
        /// <returns></returns>
        public JsonResult ObtenerTipoEmpleadoSelect()
        {
            try
            {
                string query = "SELECT * FROM tipo_empleado WHERE estado = 'A' ";
                var lista = db.Database.SqlQuery<TIPO_EMPLEADO>(query).ToList();
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
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<EMPLEADO>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = "RALOPEZ";
                    db.EMPLEADO.Add(obtenerDatos);
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
                    var obtenerDatos = JsonConvert.DeserializeObject<EMPLEADO>(datos);

                    string query = "SELECT * FROM EMPLEADO WHERE ID_EMPLEADO = " + obtenerDatos.ID_EMPLEADO;
                    var editarTabla = db.Database.SqlQuery<EMPLEADO>(query).SingleOrDefault();
                    editarTabla.ID_TIPO_EMPLEADO = obtenerDatos.ID_TIPO_EMPLEADO;
                    editarTabla.NOMBRE = obtenerDatos.NOMBRE;
                    editarTabla.DIRECCION = obtenerDatos.DIRECCION;
                    editarTabla.TELEFONO = obtenerDatos.TELEFONO;
                    editarTabla.SALARIO = obtenerDatos.SALARIO;
                    editarTabla.DIRECCION = obtenerDatos.DIRECCION;
                    editarTabla.CORREO_ELECTRONICO = obtenerDatos.CORREO_ELECTRONICO;
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
                    string query = "SELECT * FROM EMPLEADO WHERE ID_EMPLEADO = " + id;
                    var editarTabla = db.Database.SqlQuery<EMPLEADO>(query).SingleOrDefault();
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
        public JsonResult CargarTablaEmpleado()
        {
            try
            {
                string query = @"SELECT 
                                A.ID_EMPLEADO,
	                            B.ID_TIPO_EMPLEADO,
                                B.NOMBRE AS TIPO_EMPLEADO, 
	                            A.NOMBRE,A.TELEFONO, 
	                            A.DIRECCION, A.SALARIO, 
	                            A.CORREO_ELECTRONICO,
	                            A.ESTADO,
	                            CONVERT(VARCHAR(20),
                                A.FECHA_CREACION) AS FECHA_CREACION, 
	                            A.CREADO_POR 
                            FROM EMPLEADO A 
                            INNER JOIN TIPO_EMPLEADO B ON A.ID_TIPO_EMPLEADO=B.ID_TIPO_EMPLEADO";
                var lista = db.Database.SqlQuery<TABLA_EMPLEADO_>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        public class TABLA_EMPLEADO_
        {
            public int? ID_EMPLEADO { set; get; }
            public int? ID_TIPO_EMPLEADO { set; get; }
            public string TIPO_EMPLEADO { set; get; }
            public string NOMBRE { set; get; }
            public string TELEFONO { set; get; }
            public string DIRECCION { set; get; }
            public decimal? SALARIO { set; get; }
            public string CORREO_ELECTRONICO { set; get; }
            public string ESTADO { set; get; }
            public string FECHA_CREACION { set; get; }
            public string CREADO_POR { set; get; }
        }
    }
}