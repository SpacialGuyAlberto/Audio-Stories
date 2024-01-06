import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { activate } from '../../redux/actions/auth'

const ActivationScreen = ({ activate, loading, navigation, route }) => {
  const { activationToken } = route.params;
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!activated && !loading) {
      activate(activationToken);
      setActivated(true);
    }
  }, [activated, loading, activate, activationToken]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text>Activation Screen</Text>
          {activated && (
            <Button
              title="Go to Home"
              onPress={() => navigation.navigate('Home')}
            />
          )}
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
});

export default connect(mapStateToProps, {
  activate,
})(ActivationScreen);
