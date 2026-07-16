using Authorization.DTOs;
using Authorization.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Authorization.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeDocumentationController(IEmployeeDocumentationService _documentationService, IWebHostEnvironment _env) : ControllerBase
    {
        [HttpGet("getalldocumentations")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> GetAllDocumentations()
        {
            var result = await _documentationService.GetAllDocumentations();

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        [HttpPost("adddocumentation")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> AddDocumentation([FromBody] EmployeeDocumentationDto documentationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _documentationService.AddDocumentation(documentationDto);

            if (result.Item1 == 0)
                return BadRequest(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpPut("updatedocumentation")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UpdateDocumentation([FromBody] EmployeeDocumentationDto documentationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _documentationService.UpdateDocumentation(documentationDto);

            if (result.Item1 == 0)
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpDelete("deletedocumentation/{id}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> DeleteDocumentation(Guid id)
        {
            var result = await _documentationService.DeleteDocumentation(id);

            if (result.Item1 == 0)
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2
            });
        }

        [HttpGet("getdocumentationbyid/{id}")]
        public async Task<IActionResult> GetDocumentationById(Guid id)
        {
            var result = await _documentationService.GetDocumentationById(id);

            if (result.Item1 == null)
                return NotFound(new
                {
                    Success = false,
                    Message = result.Item2
                });

            return Ok(new
            {
                Success = true,
                Message = result.Item2,
                Data = result.Item1
            });
        }

        // ── NEW: Upload a physical file ────────────────────────────────────────────
        //
        // CONCEPT — IFormFile:
        //   When a browser sends a file via <input type="file">, it uses
        //   "multipart/form-data" encoding. ASP.NET Core binds that file to IFormFile.
        //
        // HOW IT WORKS:
        //   1. We receive the file bytes via IFormFile
        //   2. We build a physical path inside EmployeeDocuments/ folder
        //   3. We write the bytes to disk using FileStream
        //   4. We return the relative path → the frontend stores it in FilePath field
        //
        [HttpPost("uploadfile")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { Success = false, Message = "No file received." });

            // ContentRootPath = the folder where the .NET project runs from
            var uploadFolder = Path.Combine(_env.ContentRootPath, "EmployeeDocuments");
            Directory.CreateDirectory(uploadFolder); // safe to call even if folder exists

            // Add timestamp prefix to avoid overwriting files with the same name
            var uniqueFileName = $"{DateTime.UtcNow:yyyyMMddHHmmss}_{file.FileName}";
            var fullPath = Path.Combine(uploadFolder, uniqueFileName);

            // Write the file bytes to disk
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Store only the relative path in the DB — not the full absolute path.
            // This makes the app portable (doesn't break if you move the project folder).
            var relativePath = $"EmployeeDocuments/{uniqueFileName}";

            return Ok(new
            {
                Success = true,
                Message = "File uploaded successfully!",
                FilePath = relativePath
            });
        }

        // ── NEW: Download a file ───────────────────────────────────────────────────
        //
        // CONCEPT — File download from controller:
        //   We read the file bytes from disk and return them as a FileContentResult.
        //   The Content-Disposition: attachment header tells the browser to download it.
        //
        [HttpGet("downloadfile")]
        [Authorize]
        public IActionResult DownloadFile([FromQuery] string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath))
                return BadRequest(new { Success = false, Message = "File path is required." });

            var fullPath = Path.Combine(_env.ContentRootPath, filePath);

            if (!System.IO.File.Exists(fullPath))
                return NotFound(new { Success = false, Message = "File not found on server." });

            // Map common file extensions to their MIME types
            var extension = Path.GetExtension(fullPath).ToLowerInvariant();
            var mimeType = extension switch
            {
                ".pdf"  => "application/pdf",
                ".png"  => "image/png",
                ".jpg"  => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                _       => "application/octet-stream" // generic binary fallback
            };

            var fileName = Path.GetFileName(fullPath);
            var bytes = System.IO.File.ReadAllBytes(fullPath);

            return File(bytes, mimeType, fileName);
        }
    }
}
