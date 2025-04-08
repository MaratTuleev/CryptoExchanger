import { Pagination } from "react-bootstrap";
import { useState } from "react";

const TablePagination = ({itemsLength, itemsPerPage = 10, onPageChange = () => {}}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(itemsLength / itemsPerPage)

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum)
    onPageChange(pageNum)
  }

  return (
    <Pagination className='mt-3'>
      <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

      {[...Array(totalPages)].map((_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => handlePageChange(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  )
}

export default TablePagination