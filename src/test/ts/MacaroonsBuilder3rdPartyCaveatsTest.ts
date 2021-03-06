/*
 * Copyright 2014 Martin W. Kirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="../../typings/tsd.d.ts" />

declare var require; // TODO: bad hack to make TSC compile, possible reason https://github.com/Microsoft/TypeScript/issues/954
var expect = require('expect.js');

import MacaroonsBuilder = require('../../main/ts/MacaroonsBuilder');
import CaveatPacketType = require('../../main/ts/CaveatPacketType');
import Macaroon = require('../../main/ts/Macaroon');
import Base64Tools = require('../../main/ts/Base64Tools');


describe('MacaroonsBuilder3rdPartyCaveatsTest', function () {

  var secret = "this is a different super-secret key; never use the same secret twice";
  var publicIdentifier = "we used our other secret key";
  var location = "http://mybank/";

  var caveat_key = "4; guaranteed random by a fair toss of the dice";
  var predicate = "user = Alice";
  var identifier = "this was how we remind auth of key/pred";

  var vidAsBase64 = new Buffer(Base64Tools.transformBase64UrlSafe2Base64("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA027FAuBYhtHwJ58FX6UlVNFtFsGxQHS7uD_w_dedwv4Jjw7UorCREw5rXbRqIKhr"), 'base64');

  it("add third party caveat", function () {

    var m = new MacaroonsBuilder(location, secret, publicIdentifier)
        .add_first_party_caveat("account = 3735928559")
        .add_third_party_caveat("http://auth.mybank/", caveat_key, identifier)
        .getMacaroon();


    expect(m.identifier).to.be(publicIdentifier);
    expect(m.location).to.be(location);
    expect(m.caveatPackets[0].type).to.be(CaveatPacketType.cid);
    expect(m.caveatPackets[0].getValueAsText()).to.be("account = 3735928559");
    expect(m.caveatPackets[1].type).to.be(CaveatPacketType.cid);
    expect(m.caveatPackets[1].getValueAsText()).to.be(identifier);
    expect(m.caveatPackets[2].type).to.be(CaveatPacketType.vid);
    expect(m.caveatPackets[2].getRawValue().toString('base64')).to.be(vidAsBase64.toString('base64'));
    expect(m.caveatPackets[3].type).to.be(CaveatPacketType.cl);
    expect(m.caveatPackets[3].getValueAsText()).to.be('http://auth.mybank/');
    expect(m.signature).to.be("d27db2fd1f22760e4c3dae8137e2d8fc1df6c0741c18aed4b97256bf78d1f55c");
    expect(m.serialize()).to.be("MDAxY2xvY2F0aW9uIGh0dHA6Ly9teWJhbmsvCjAwMmNpZGVudGlmaWVyIHdlIHVzZWQgb3VyIG90aGVyIHNlY3JldCBrZXkKMDAxZGNpZCBhY2NvdW50ID0gMzczNTkyODU1OQowMDMwY2lkIHRoaXMgd2FzIGhvdyB3ZSByZW1pbmQgYXV0aCBvZiBrZXkvcHJlZAowMDUxdmlkIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANNuxQLgWIbR8CefBV-lJVTRbRbBsUB0u7g_8P3XncL-CY8O1KKwkRMOa120aiCoawowMDFiY2wgaHR0cDovL2F1dGgubXliYW5rLwowMDJmc2lnbmF0dXJlINJ9sv0fInYOTD2ugTfi2Pwd9sB0HBiu1LlyVr940fVcCg");
  });


});
