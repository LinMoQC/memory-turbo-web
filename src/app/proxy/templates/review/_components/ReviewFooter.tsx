import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

interface ReviewFooterProps {
    page: string | null;
    hasNext: boolean;
}

const ReviewFooter: React.FC<ReviewFooterProps> = (props: ReviewFooterProps) => {
    const {page,hasNext} = props
    const router = useRouter()

    const handleNext = () => {
        if(!page){
            router.push(`/proxy/templates/review?page=2`)
        }else{
            router.push(`/proxy/templates/review?page=${Number(page)+1}`)
        }
    }

    const handlePre = () => {
        router.push(`/proxy/templates/review?page=${Number(page)-1}`)
    }

    return (
        <div className="absolute bottom-2 right-4">
            <Pagination>
                <PaginationContent>
                    {(Number(page) > 1) && <PaginationItem>
                        <PaginationPrevious aria-disabled={true} onClick={handlePre} className="cursor-pointer"/>
                    </PaginationItem>}
                    {hasNext && <PaginationItem>
                        <PaginationNext onClick={handleNext} className="cursor-pointer"/>
                    </PaginationItem>}
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ReviewFooter