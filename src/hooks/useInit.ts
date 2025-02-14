import { getAllLowCode } from "@/lib/action";
import { useLowCodeTemplateStore } from "@/stores/lowcode-template";

const useInit = () => {
    const { setTemplateList } = useLowCodeTemplateStore();

    async function initTemplateList(){
        setTemplateList(await getAllLowCode())
    }

    return {
        initTemplateList
    }
}

export default useInit