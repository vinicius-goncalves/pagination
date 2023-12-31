import settings from 'settings';
import { renderPages, calcConditions } from './pages.js';
import createButton from 'create-button';

interface Buttons {
    nextBtn: HTMLButtonElement;
    previousBtn: HTMLButtonElement;
}

const pagination = document.querySelector('[data-pagination="wrapper"]') as HTMLDivElement;

pagination.addEventListener('pageupdated', (event: Event) => {

    const { nextBtn, previousBtn } = (event as CustomEvent).detail;
    const { totalPages } = calcConditions({ maxPerPage: settings.maxPerPage });

    previousBtn.style.display = settings.currPage <= 1 ? 'none' : 'block';
    nextBtn.style.display = settings.currPage > totalPages - 1 ? 'none' : 'block';

});

function createVirtualButtons(): Buttons {

    const nextBtn: HTMLButtonElement = createButton('next');
    const previousBtn: HTMLButtonElement = createButton('previous');

    const pageUpdated: CustomEvent<unknown> = new CustomEvent('pageupdated', {
        detail: { nextBtn, previousBtn }
    });

    pagination.dispatchEvent(pageUpdated);
    pagination.addEventListener('click', (event: Event): void => {

        const targetClicked = event.target as Element;
        const closestBtn = targetClicked.matches('button') ? targetClicked : targetClicked.closest('button');

        if(!closestBtn) {
            return;
        }

        const clickedOnNextBtn = closestBtn.isEqualNode(nextBtn);
        renderPages(clickedOnNextBtn ? ++settings.currPage : --settings.currPage);

        pagination.dispatchEvent(pageUpdated);
    });

    return { previousBtn, nextBtn  } as Buttons;
}

function renderButtons(): void {

    const { previousBtn, nextBtn  }: Buttons = createVirtualButtons();

    return (() => {

        const nodes: HTMLButtonElement[] = [nextBtn, previousBtn];
        const existedNodes: HTMLButtonElement[] = nodes.filter(node => pagination.contains(node));

        if(existedNodes.length === nodes.length) {
            return;
        }

        nodes.forEach((node: HTMLButtonElement): void => {
            pagination.insertAdjacentElement(node.classList.contains('next') ? 'beforeend' : 'afterbegin', node);
        });

    })();
}

export default renderButtons;