import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react"
import type { PaginationMeta } from "@/lib/pagination"


export interface ResponsivePaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  siblingCount?: number
}

export function ResponsivePagination({
  meta,
  onPageChange,
  siblingCount = 1,
}: ResponsivePaginationProps) {
  const { page, totalPages, hasNext, hasPrev } = meta

  // Logic to calculate the array of page numbers (e.g. [1, 2, '...', 10])
  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5

    // Case 1: If the number of pages is less than the page numbers we want to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1)
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1)
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    // Case 2: No left dots, but right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, idx) => idx + 1)
      return [...leftRange, "...", totalPages]
    }

    // Case 3: No right dots, but left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, idx) => totalPages - rightItemCount + idx + 1
      )
      return [firstPageIndex, "...", ...rightRange]
    }

    // Case 4: Both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, idx) => leftSiblingIndex + idx
      )
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex]
    }
    
    return []
  }, [page, totalPages, siblingCount])

  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent className="w-full justify-between sm:justify-center">
        
        {/* First Page Button */}
        <PaginationItem>
          <PaginationLink
            aria-label="Go to first page"
            size="icon"
            className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) onPageChange(1)
            }}
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            size="icon"
            className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
            onClick={(e) => {
              e.preventDefault()
              if (hasPrev) onPageChange(page - 1)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationPrevious>
        </PaginationItem>

        {/* MOBILE VIEW: Simple Text (Hidden on sm screens and up) */}
        <div className="flex items-center text-sm font-medium sm:hidden mx-2">
          Page {page} of {totalPages}
        </div>

        {/* DESKTOP VIEW: Numbered List (Hidden on xs screens) */}
        <div className="hidden sm:flex flex-row items-center gap-1">
          {paginationRange.map((pageNumber, idx) => {
            if (pageNumber === "...") {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={page === pageNumber}
                  size="icon"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(pageNumber as number)
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          })}
        </div>

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            size="icon"
            className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
            onClick={(e) => {
              e.preventDefault()
              if (hasNext) onPageChange(page + 1)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationNext>
        </PaginationItem>

        {/* Last Page Button */}
        <PaginationItem>
          <PaginationLink
            aria-label="Go to last page"
            size="icon"
            className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            onClick={(e) => {
              e.preventDefault()
              if (page < totalPages) onPageChange(totalPages)
            }}
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}