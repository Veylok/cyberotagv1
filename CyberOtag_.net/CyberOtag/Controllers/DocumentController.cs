using Microsoft.AspNetCore.Mvc;
using DbAccess.DBModels;
using Service.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly DService _documentService;

        public DocumentController(DService documentService)
        {
            _documentService = documentService;
        }

        [HttpGet]
        public IActionResult GetAllDocuments()
        {
            List<Document> allDocuments = _documentService.GetAllDocuments();
            return Ok(allDocuments);
        }

        [HttpGet("{documentId}")]
        public IActionResult GetDocumentById(int documentId)
        {
            Document documentData = _documentService.GetDocumentById(documentId);
            if (documentData == null)
            {
                return NotFound();
            }
            return Ok(documentData);
        }

        [HttpPost]
        public IActionResult AddDocument([FromForm] DocumentUploadModel documentModel)
        {
            if (documentModel == null || documentModel.DocumentFile == null)
            {
                return BadRequest("Belge veya dosya eksik.");
            }

            try
            {
                var document = new Document
                {
                    Spendingid = documentModel.Spendingid,
                    Documentimg = ReadFile(documentModel.DocumentFile),
                };

                _documentService.AddDocument(document);

                return Ok("Belge eklendi.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hata: {ex.Message}");
            }
        }

        [HttpPut("{documentId}")]
        public IActionResult UpdateDocument(int documentId, [FromForm] DocumentUploadModel documentModel)
        {
            var existingDocument = _documentService.GetDocumentById(documentId);
            if (existingDocument == null)
            {
                return NotFound();
            }

            if (documentModel == null || documentModel.DocumentFile == null)
            {
                return BadRequest("Belge veya dosya eksik.");
            }

            try
            {
                var updatedDocument = new Document
                {
                    Documentid = documentId,
                    Spendingid = documentModel.Spendingid,
                    Documentimg = ReadFile(documentModel.DocumentFile),
                };

                _documentService.UpdateDocument(updatedDocument);

                return Ok("Belge güncellendi.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hata: {ex.Message}");
            }
        }

        [HttpDelete("{documentId}")]
        public IActionResult DeleteDocument(int documentId)
        {
            if (_documentService.GetDocumentById(documentId) == null)
            {
                return NotFound();
            }
            _documentService.DeleteDocument(documentId);
            return Ok();
        }

        private byte[] ReadFile(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }

    public class DocumentUploadModel
    {
        public int? Spendingid { get; set; }
        public IFormFile DocumentFile { get; set; }
    }
}
