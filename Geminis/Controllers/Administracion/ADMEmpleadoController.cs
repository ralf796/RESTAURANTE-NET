using BE;
using BLL;
using Geminis.Clases;
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
        // GET: ADMEmpleado
        public ActionResult Index()
        {
            return View();
        }

        public PartialViewResult Listar()
        {
            Administracion_BE item = new Administracion_BE { MTIPO = 6 };
            List<Administracion_BE> lst = new List<Administracion_BE>();
            lst = BackTools.Administracion_store_procedure(item);
            ViewBag.data = lst;
            return PartialView();
        }

        [SessionExpireFilter]
        public JsonResult Guardar(int id_tipo_empleado = 0, string nombre = "", decimal salario = 0, string telefono = "", string correo = "", string direccion = "")
        {
            var respuesta = new Respuesta();
            try
            {
                List<Administracion_BE> RESULT_SP = new List<Administracion_BE>();
                Administracion_BE item = new Administracion_BE
                {
                    MTIPO = 3,
                    ID_TIPO_EMPLEADO = id_tipo_empleado,
                    NOMBRE = nombre,
                    SALARIO = salario,
                    TELEFONO = telefono,
                    CORREO_ELECTRONICO = correo,
                    DIRECCION = direccion,
                    CREADO_POR = Session["usuario"].ToString()
                };
                RESULT_SP = BackTools.Administracion_store_procedure(item);

                if (RESULT_SP.Count() == 0)
                {
                    respuesta.Codigo = 2;
                    respuesta.Descripcion = "No se ha podido guardar el Empleado.";
                }
                else
                {
                    respuesta.Codigo = 1;
                    respuesta.Descripcion = "Empleado creado correctamente";
                }
            }
            catch (Exception ex)
            {
                respuesta.Codigo = -1;
                respuesta.Descripcion = $"Mensaje: {ex.Message}";
            }
            return Json(respuesta);
        }
        
    }
}