import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const normalizedURI = async( uri : string ): Promise<string>=>{
    const stat = await RNFS.stat(uri);
    const normalized = `${Platform.OS === 'android' ? 'file://' : ''}${stat.originalFilepath}`;
    return normalized;
}
export default normalizedURI;