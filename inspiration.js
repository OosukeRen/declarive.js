const INVOICE_STATUSES = {
    DRAFT: "draft",
    OPEN: "open",
    PAID: "paid",
    VOID: "void",
    UNCOLLECTABLE: "uncollectable",
}

class Invoice {
    constructor (initial) {
        this.status = initial || INVOICE_STATUSES.DRAFT
    }

    status;

    state() {
        let classToInstantiate = CLASS_MAPPING[this.status];

        if(classToInstantiate) {
            return new classToInstantiate(this)
        } else {
            throw new Error("Invalid Status");
        }
    }
}

class BaseInvoiceState {
    constructor (invoice) {
        this.invoice = invoice;
    }

    #error = function (action) {
        throw new Error(`Cannot invoke action ${action} from status ${this.invoice.status}`)
    }

    finalize () {
        this.#error('finalize');
    }

    pay () {
        this.#error('pay');
    }

    void () {
        this.#error('void');
    }

    cancel () {
        this.#error('cancel');
    }

    invoice;
}

class DraftInvoiceState extends BaseInvoiceState {
    finalize() {
        this.invoice.status = INVOICE_STATUSES.OPEN;
        console.log(`FINALIZED DRAFT`)
    }
}

class OpenInvoiceState extends BaseInvoiceState {
    pay () {
        this.invoice.status = INVOICE_STATUSES.PAID;
        console.log(`FINALIZED DRAFT`)
    }

    void () {
        this.invoice.status = INVOICE_STATUSES.VOID;
    }
    
    cancel () {
        this.invoice.status = INVOICE_STATUSES.UNCOLLECTABLE;
    }
}

class PaidInvoiceState extends BaseInvoiceState {

}

class VoidInvoiceState extends BaseInvoiceState {

}

class UncollectableInvoiceState extends BaseInvoiceState {
    pay () {
        this.invoice.status = INVOICE_STATUSES.PAID;
    }

    void () {
        this.invoice.status = INVOICE_STATUSES.VOID;
    }
}

const CLASS_MAPPING = {
    [INVOICE_STATUSES.DRAFT]: DraftInvoiceState,
    [INVOICE_STATUSES.OPEN]: OpenInvoiceState,
    [INVOICE_STATUSES.PAID]: PaidInvoiceState,
    [INVOICE_STATUSES.VOID]: VoidInvoiceState,
    [INVOICE_STATUSES.UNCOLLECTABLE]: UncollectableInvoiceState,
}

let invoice = new Invoice();
invoice.state().finalize();
console.log(invoice.status);