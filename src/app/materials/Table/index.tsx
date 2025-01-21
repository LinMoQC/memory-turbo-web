import { ComponentConfig } from "../../pages/editor/stores/component-config";
import TableDev from "./dev";

export const TableConfig: ComponentConfig = {
    name: 'Table',
    defaultProps: {},
    desc: '表格',
    setter: [
        {
            name: 'url',
            label: 'url',
            type: 'input',
        },
    ],
    dev: TableDev,
    prod: TableDev,
    materialType: 'area'
}

