import 'reflect-metadata'

export module Context {

    class Context {
        UserAccessLevel: String | undefined
    }

    export var context = new Context()

}
