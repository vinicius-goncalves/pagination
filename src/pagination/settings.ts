interface PaginationSettings {
    currPage: number;
    maxPerPage: number;
    contentLength: number;
}

const settings: PaginationSettings = {
    currPage: 1,
    maxPerPage: 5,
    contentLength: 50
};

export default settings;