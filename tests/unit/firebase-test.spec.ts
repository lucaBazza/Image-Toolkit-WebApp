/**
 *      Use mocha for testing -> go to jests
 *      
 *      official docs:
 *          https://firebase.google.com/docs/rules/unit-tests
 */

const assert = require('assert')

const { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } = require("@firebase/rules-unit-testing")
import * as fs from 'fs'

import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import 'firebase/compat/auth'
import { FirebaseApp } from '@firebase/app'

import { getDoc } from "firebase/firestore"


const MY_PROJECT_ID = 'image-toolkit-app'

describe('My firebase test connection',()=>{
    //jest.setTimeout(15*1000)
    it('Can read items in the read-only collection', async ()=>{
        /* const db = await initializeTestEnvironment({projectId: MY_PROJECT_ID}).firestore({
            rules: fs.readFileSync("firestore.rules", "utf8"),
          }) */
        let testEnv = initializeTestEnvironment({
            projectId: {projectId: MY_PROJECT_ID},
           /*  firestore: {
                rules: fs.readFileSync("firestore.rules", "utf8"),
                host: '0.0.0.0',
                port: '8081'
            } */
        })
        //await assertSucceeds( testEnv.firestore().collection('readonly'). getDoc('testDoc'))

        //const db = testEnv.firestore()
        //const testDoc = db.collection('readonly').doc('testDoc')
        //await assertSucceeds(testDoc.get())

        // await assertSucceeds(true)
    })

    
})