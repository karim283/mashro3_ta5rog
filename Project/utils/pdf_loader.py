import logging
from pathlib import Path

import fitz
from langchain.docstore.document import Document

logger = logging.getLogger(__name__)


def load_pdfs(data_dir: Path) -> list[Document]:
    """Recursively load PDFs from the data directory and convert pages to documents."""
    documents = []
    pdf_paths = sorted(data_dir.rglob("*.pdf"))

    if not pdf_paths:
        logger.warning("No PDF files found in %s", data_dir)
        return documents

    for pdf_path in pdf_paths:
        try:
            with fitz.open(pdf_path) as pdf:
                for page_number in range(len(pdf)):
                    page = pdf.load_page(page_number)
                    text = page.get_text("text")
                    if not text or not text.strip():
                        continue

                    documents.append(
                        Document(
                            page_content=text,
                            metadata={
                                "source": str(pdf_path),
                                "page": page_number + 1,
                            },
                        )
                    )
        except Exception as error:
            logger.exception("Failed to read PDF %s: %s", pdf_path, error)

    return documents
