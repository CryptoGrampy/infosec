import axios from 'axios';
import crypto from 'crypto';
import * as Axios from './Axios/Clients';
import * as Constants from './Config/constants';
import * as Interfaces from './Config/interfaces';

/**
 * Wrapper to authenticate with prokurilo and set the signature for
 * all rpc requests.
 * @param address - primary address
 * @param isInitial - boolean to use address for initial prokurilo handshake
 */
export const authenticate = async (address: string | null, isInitial: boolean): Promise<void> => {
  // use challenge to generate signature
  // retry with signature
  if (!Constants.IS_DEV) {
    const hash = crypto.createHash('sha256');
    await Axios.RPC.post(Constants.JSON_RPC, {})
      .catch(async (e) => {
        const authHeader: string = JSON.parse(JSON.stringify(e)).config.headers['www-authenticate'];
        const challenge = authHeader.split('challenge=')[1];
        const sBody: Interfaces.SignRequest = Constants.SIGN_REQUEST;
        sBody.params.data = challenge;
        const sign: Interfaces.SignResponse = await (
          await Axios.RPC.post(Constants.JSON_RPC, sBody)
        ).data;
        const sig = sign.result.signature;
        hash.update(sig);
        const basic = isInitial ? `${address}:${sig}` : `${hash.digest('hex')}:${sig}`;
        // set the auth globally;
        axios.defaults.headers.post.Authorization = `basic ${basic}`;
      });
  }
};
